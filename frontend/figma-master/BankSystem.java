public class BankSystem {
    static BankAccount[] accounts = new BankAccount[10];

    public static void main(String[] args) {
        // Create some sample accounts
        accounts[0] = new BankAccount("John Doe", 1001, 500.0);
        accounts[1] = new BankAccount("Jane Smith", 1002, 1000.0);

        // Display initial balances
        System.out.println("Initial Balances:");
        accounts[0].display();
        accounts[1].display();

        // Perform some transactions
        accounts[0].deposit(200.0);
        accounts[1].withdraw(300.0);

        // Display updated balances
        System.out.println("\nUpdated Balances:");
        accounts[0].display();
        accounts[1].display();
    }
}

class BankAccount {
    private String accountHolderName;
    private int accountNumber;
    private double balance;

    // Constructor
    public BankAccount(String accountHolderName, int accountNumber, double initialBalance) {
        this.accountHolderName = accountHolderName;
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    // Deposit method
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited $" + amount + ". New balance: $" + balance);
        } else {
            System.out.println("Invalid deposit amount.");
        }
    }

    // Withdraw method
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrew $" + amount + ". New balance: $" + balance);
        } else {
            System.out.println("Invalid withdrawal amount or insufficient funds.");
        }
    }

    // Display method
    public void display() {
        System.out.println("Account Holder: " + accountHolderName);
        System.out.println("Account Number: " + accountNumber);
        System.out.println("Balance: $" + balance);
        System.out.println();
    }
}
