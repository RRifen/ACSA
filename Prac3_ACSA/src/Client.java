import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class Client {
    public static void main(String[] args) throws Exception {
        if (args.length != 1) {
            System.err.println("Enter IP-address as argument");
            return;
        }

        try (var socket = new Socket(args[0], 59898)) {
            System.out.println("Enter strings of text, then \"ctrl + c\" to exit");

            var scanner = new Scanner(System.in);

            var in = new Scanner(socket.getInputStream());
            var out = new PrintWriter(socket.getOutputStream(), true);

            startServerInputThread(in);

            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                out.println(line);
            }
        }
    }

    public static void startServerInputThread(Scanner in) {
        new Thread(() -> {
            while(true) {
                if (in.hasNextLine()) {
                    System.out.println(in.nextLine());
                }
            }
        }).start();
    }

}
