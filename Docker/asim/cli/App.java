import java.sql.*;
import java.util.*;

class Account {
    int accountId;
    String name;
    String email;
    String password;
    double balance;

    Account(int accountId, String name, String email, String password, double balance) {
        this.accountId = accountId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.balance = balance;
    }
}

class AccountRepository {
    private Connection conn;

    AccountRepository() {
        connectWithRetry();
        createTableIfNeeded();
    }

    private void connectWithRetry() {
        String url = "jdbc:mysql://db:3306/payment_db";
        String user = "root";
        String pass = "root";

        for (int i = 1; i <= 30; i++) {
            try {
                conn = DriverManager.getConnection(url, user, pass);
                System.out.println("Connected to MySQL!");
                return;
            } catch (SQLException e) {
                System.out.println("Waiting for MySQL... attempt " + i + "/30");
                try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
            }
        }
        System.out.println("Could not connect to MySQL after 30 attempts. Exiting.");
        System.exit(1);
    }

    private void createTableIfNeeded() {
        try (Statement st = conn.createStatement()) {
            st.execute("""
                CREATE TABLE IF NOT EXISTS accounts (
                    account_id INT PRIMARY KEY,
                    name       VARCHAR(255) NOT NULL,
                    email      VARCHAR(255) NOT NULL,
                    password   VARCHAR(255) NOT NULL,
                    balance    DOUBLE DEFAULT 0.0
                )
            """);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    List<Account> loadAll() {
        List<Account> list = new ArrayList<>();
        try (Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT * FROM accounts")) {
            while (rs.next()) {
                list.add(new Account(
                    rs.getInt("account_id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("password"),
                    rs.getDouble("balance")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    void save(Account a) {
        String sql = """
            INSERT INTO accounts (account_id, name, email, password, balance)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name=?, email=?, password=?, balance=?
        """;
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, a.accountId);
            ps.setString(2, a.name);
            ps.setString(3, a.email);
            ps.setString(4, a.password);
            ps.setDouble(5, a.balance);
            ps.setString(6, a.name);
            ps.setString(7, a.email);
            ps.setString(8, a.password);
            ps.setDouble(9, a.balance);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    void saveAll(Collection<Account> accounts) {
        for (Account a : accounts) {
            save(a);
        }
    }
}

class PaymentService {
    private final AccountRepository repo = new AccountRepository();
    private final Map<Integer, Account> accountMap = new HashMap<>();

    PaymentService() {
        for (Account a : repo.loadAll())
            accountMap.put(a.accountId, a);
    }

    private int generateAccountId() {
        Random r = new Random();
        int id;
        do { id = r.nextInt(1000) + 1; }
        while (accountMap.containsKey(id));
        return id;
    }

    Account signUp(String name, String email, String password) {
        int id = generateAccountId();
        Account acc = new Account(id, name, email, password, 0);
        accountMap.put(id, acc);
        repo.save(acc);
        return acc;
    }

    Account login(String email, String password) {
        for (Account a : accountMap.values())
            if (a.email.equals(email) && a.password.equals(password))
                return a;
        return null;
    }

    Collection<Account> listAllAccounts() {
        return accountMap.values();
    }

    Account getById(int id) {
        return accountMap.get(id);
    }

    boolean sendMoney(Account from, int toId, double amount) {
        Account to = accountMap.get(toId);
        if (to == null || amount <= 0 || from.balance < amount)
            return false;

        from.balance -= amount;
        to.balance += amount;
        repo.save(from);
        repo.save(to);
        return true;
    }

    void deposit(Account acc, double amt) {
        acc.balance += amt;
        repo.save(acc);
    }

    void changePassword(Account acc, String pass) {
        acc.password = pass;
        repo.save(acc);
    }
}

public class App {
    private static final Scanner sc = new Scanner(System.in);
    private static final PaymentService service = new PaymentService();

    private static int readInt() {
        while (true) {
            try { return Integer.parseInt(sc.nextLine()); }
            catch (Exception e) { System.out.print("Enter a valid number: "); }
        }
    }

    private static double readDouble() {
        while (true) {
            try { return Double.parseDouble(sc.nextLine()); }
            catch (Exception e) { System.out.print("Enter a valid amount: "); }
        }
    }

    private static void listAllAccounts() {
        System.out.println("Account Number ->\t Name");
        for (Account a : service.listAllAccounts())
            System.out.println(a.accountId + " ->\t\t\t " + a.name);
    }

    private static void signup() {
        System.out.print("Name: ");
        String name = sc.nextLine();
        System.out.print("Email: ");
        String email = sc.nextLine();
        System.out.print("Password: ");
        String pass = sc.nextLine();

        Account a = service.signUp(name, email, pass);
        System.out.println("Account Created");
        System.out.println("Your Account Number: " + a.accountId);
    }

    private static void login() {
        System.out.print("Email: ");
        String email = sc.nextLine();
        System.out.print("Password: ");
        String pass = sc.nextLine();

        Account acc = service.login(email, pass);
        if (acc == null) {
            System.out.println("Invalid login");
            return;
        }
        dashboard(acc);
    }

    private static void dashboard(Account acc) {
        while (true) {
            System.out.println("""
                                    -----------------------------
                                    Welcome \t""" + acc.name +"\n"+ 
                                    """
                                    -----------------------------
                                    1. Send Money
                                    2. Check Balance
                                    3. Deposit
                                    4. Change Password
                                    -1. Logout
                                    """);

            int ch = readInt();
            switch (ch) {
                case 1 -> sendMoney(acc);
                case 2 -> System.out.println("Balance: Rs " + String.format("%.2f", acc.balance));
                case 3 -> deposit(acc);
                case 4 -> changePassword(acc);
                case -1 -> { return; }
                default -> System.out.println("Invalid option");
            }
        }
    }

    private static void sendMoney(Account acc) {
        listAllAccounts();
        System.out.print("Enter Receiver Account Number: ");
        int toId = readInt();
        System.out.print("Amount: ");
        double amt = readDouble();

        Account receiver = service.getById(toId);
        if (receiver == null) {
            System.out.println("No such account exists");
            return;
        }

        boolean ok = service.sendMoney(acc, toId, amt);
        System.out.println(ok
                ? "Successfully sent Rs " + amt + " to " + receiver.name
                : "Payment failed (insufficient balance)");
    }

    private static void deposit(Account acc) {
        System.out.print("Amount: ");
        double amt = readDouble();
        service.deposit(acc, amt);
        System.out.println("Money Deposited");
    }

    private static void changePassword(Account acc) {
        System.out.print("New Password: ");
        String p1 = sc.nextLine();
        System.out.print("Confirm Password: ");
        String p2 = sc.nextLine();

        if (!p1.equals(p2)) {
            System.out.println("Password mismatch");
            return;
        }
        service.changePassword(acc, p1);
        System.out.println("Password updated");
    }

    public static void main(String[] args) {
        while (true) {
            System.out.println("""
                            ===========================
                                    PAYMENT APP
                            ===========================
                            1. Login
                            2. Sign Up
                            3. List All Accounts
                            -1. Exit
                            """);

            int ch = readInt();
            if (ch == 1) login();
            else if (ch == 2) signup();
            else if (ch == 3) listAllAccounts();
            else if (ch == -1) System.exit(0);
            else System.out.println("Invalid option");
        }
    }
}
