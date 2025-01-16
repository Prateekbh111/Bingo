# 🎉 Bingo Game Monorepo

Welcome to the **Bingo Game Monorepo**! This repository contains both the **Next.js app** and the **WebSocket server** for real-time communication. The project is designed to provide an exciting and seamless multiplayer Bingo experience. 🚀

## 🗂️ Project Structure

This is a monorepo managed using **Turborepo**. Here's the structure:

```
root/
├── apps/
│   ├── web/         # Next.js frontend
│   └── ws/          # WebSocket server
├── packages/db/
│   └── prisma/      # Prisma database schema
│   └── src/         # Global DB singleton
└── .turbo/          # Turborepo configuration
```

### Apps:

- **web**: The main frontend for the Bingo game, built with Next.js.
- **ws**: The backend server for real-time communication using WebSocket.

---

## 🚀 Features

- 🔥 **Real-time gameplay** powered by WebSocket.
- 🎨 **Responsive UI** using modern design with **shadcn/ui**.
- 🔗 **Secure deployment** on AWS EC2 with **NGINX** and **SSL**.
- 📦 **Monorepo structure** for easy management and scalability.
- 🛠️ **Turborepo** for efficient builds and development.

---

## 📋 Requirements

- Node.js (v18 or later)
- bun

---

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/prateekbh111/bingooo.site.git
   cd bingooo.site
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:

   Create a `.env` file in the `apps/web/` as well as `packages/db/` directory and add the following:

   ```env
   NEXTAUTH_URL
   NEXTAUTH_SECRET
   DATABASE_URL
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   PUSHER_APP_ID
   NEXT_PUBLIC_PUSHER_APP_KEY
   PUSHER_APP_SECRET
   NEXT_PUBLIC_WEB_SOCKET_URL
   ```

4. Start the development servers:

   ```bash
   bun run dev
   ```

   This will start both the Next.js app and the WebSocket server.

---

## 🎮 Usage

1. Open the Next.js app in your browser:

   ```
   http://localhost:3000
   ```

2. Create or join a Bingo game.

3. Enjoy the game with your friends in real-time! 🎉

---

## 🔧 Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the Next.js app.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs linting.

---

## 🙌 Contributing

Feel free to open issues or submit pull requests if you find bugs or have suggestions to improve the project. Contributions are always welcome! 🤝

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For any queries, reach out to **Prateek Bhardwaj**:

- Email: [prateekbh111@gmail.com](mailto:prateekbh111@gmail.com)
- Portfolio: [prateekbh111-portfolio.vercel.app](https://prateekbh111-portfolio.vercel.app)
- X: [@prateekbh111](https://x.com/prateekbh111)

---

Happy coding! 🚀
