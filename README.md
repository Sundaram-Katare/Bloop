# Kanban Task Management Board

A modern, responsive Kanban-style task board built with Next.js 15, TypeScript, and Tailwind CSS. Manage your tasks across different stages with smooth drag-and-drop functionality.

🔗 **[Live Demo](https://kanban-board-chi-wine.vercel.app/)**  
🎥 **[Video Walkthrough](https://your-loom-video-link)**

---

## ✨ Features

- Create, edit, and delete tasks with title and description
- Drag and drop tasks between columns (To Do, In Progress, Done)
- Data persistence using localStorage
- Fully responsive design for mobile and desktop
- Real-time task count per column

---

## 🚀 Setup Instructions

### Installation

1. **Fork the repository**

2. **Clone the repository**
```bash
 git clone https://github.com/username/kanban-board
```

3. **Install Dependencies**
```bash
 npm install 
```

4. **Run the development server**
```bash
 npm run dev
```

5. **Navigate to localhost://3000**

---


---

## 🛠️ Tech Stack Explanation

**Next.js 15 (App Router):** Chose Next.js for its built-in optimization, server-side rendering capabilities, and excellent developer experience with the new App Router providing better performance and cleaner routing structure.

**TypeScript:** Ensures type safety throughout the application, reducing runtime errors and improving code maintainability and readability.

**Tailwind CSS:** Enables rapid UI development with utility-first classes and for styling the UI.

**ShadCN** Used the `sonner` component of shadCN library to get a toast message on adding or deleting the tasks.

**dnd-kit:** Selected over react-beautiful-dnd because it's actively maintained, has better TypeScript support, and provides more flexibility for custom drag-and-drop interactions.

**localStorage:** Provides instant data persistence without backend setup, making the app functional immediately while maintaining simplicity for the assignment scope.

---

## 🤖 AI Tool Usage

**ChatGPT & Claude:** Used for understanding dnd-kit documentation, and debugging TypeScript type issues. Also used for optimizing Tailwind CSS utility classes and suggesting best practices for React hooks.

**Key Note:** All AI-generated code was reviewed, understood, and modified to fit the specific requirements and maintain clean code standards.

---

##  Known Issue

**localStorage Limitations:** Data is stored only in the browser's localStorage, meaning tasks won't sync across different devices or browsers. Future enhancement could implement a backend API with database storage.

---

## Author 🙋
**Sundaram Katare**

Built with 🧠
