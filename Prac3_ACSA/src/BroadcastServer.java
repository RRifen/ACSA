import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.*;
import java.util.concurrent.Executors;

public class BroadcastServer {
    private static final List<String> listStrings = Collections.synchronizedList(new ArrayList<>());
    private static final List<String> listNicknames = Collections.synchronizedList(new ArrayList<>());
    private static final List<PrintWriter> listOutSockets = Collections.synchronizedList(new ArrayList<>());
    public static void main(String[] args) throws Exception {
        try (var listener = new ServerSocket(59898)) {
            var pool = Executors.newFixedThreadPool(20);
            System.out.println("Server is running...");

            pool.execute(new BroadCastHandler());

            while (true) {
                pool.execute(new ClientInputHandler(listener.accept()));
            }
        }
    }

    private static class ClientInputHandler implements Runnable {
        private Socket socket;

        ClientInputHandler(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            System.out.println("Connection: " + socket);

            PrintWriter out = null;
            try {

                var in = new Scanner(socket.getInputStream());
                out = new PrintWriter(socket.getOutputStream(), true);

                String nickname = inputNickname(in, out);
                listOutSockets.add(out);

                while (in.hasNextLine()) {
                    listStrings.add(String.format("[%s] %s", nickname, in.nextLine()));
                }
            } catch (Exception e) {
                System.out.println("Error: " + socket);
            } finally {
                try {
                    listOutSockets.remove(out);
                    socket.close();
                } catch (IOException | NullPointerException ignored) {
                }
                System.out.println("Closed: " + socket);
            }
        }
    }

    private static class BroadCastHandler implements Runnable {
        @Override
        public void run() {
            try {
                while (true) {
                    Thread.sleep(5000);
                    synchronized (listOutSockets) {
                    for (var out : listOutSockets) {
                        synchronized (listStrings) {
                        for (String str : listStrings) {
                            out.println(str);
                        }
                        }
                    }
                    listStrings.clear();
                    }
                }
            }
            catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private static String inputNickname(Scanner in, PrintWriter out) {
        out.println("[Server] Enter your name");
        boolean isSetNick = false;
        String nickname = null;
        while(!isSetNick) {
            nickname = in.nextLine();
            isSetNick = true;
            synchronized (listNicknames) {
            for (String str : listNicknames) {
                if (str.equals(nickname)) {
                    isSetNick = false;
                    out.println("[Server] Name already exists");
                    out.println("[Server] Enter another name: ");
                }
            }
            }
        }
        out.println("[Server] You were connected to server");
        listNicknames.add(nickname);
        return nickname;
    }


}
