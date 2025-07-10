# StaffX - HR Management System

A modern, responsive HR management system built with Vue 3, Vite, and TailwindCSS. StaffX provides a comprehensive solution for managing employees, processing payroll, and tracking HR metrics with a beautiful, intuitive interface.

## ✨ Features

- **🎨 Modern UI/UX**: Clean, responsive design with dark/light mode support
- **👥 Employee Management**: Add, edit, and manage employee profiles
- **💰 Payroll Processing**: Comprehensive payroll management system
- **📊 Analytics Dashboard**: Real-time insights and metrics
- **🔍 Advanced Search**: Filter and search employees efficiently
- **📱 Mobile Responsive**: Works perfectly on all device sizes
- **🌙 Dark Mode**: Automatic theme switching with system preference detection
- **⚡ Lightning Fast**: Built with Vite for optimal performance

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Icons**: Lucide Vue Next
- **Development**: ESLint, Prettier

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd staffx
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
staffx/
├── public/                 # Static assets
├── src/
│   ├── assets/            # CSS and other assets
│   │   └── css/
│   │       └── tailwind.css
│   ├── components/        # Reusable components
│   │   ├── layout/        # Layout components
│   │   │   ├── DefaultLayout.vue
│   │   │   ├── SidebarMenu.vue
│   │   │   └── TopNav.vue
│   │   └── ui/            # UI components
│   ├── stores/            # Pinia stores
│   │   ├── auth.js        # Authentication store
│   │   └── theme.js       # Theme management store
│   ├── views/             # Page components
│   │   ├── Dashboard.vue
│   │   ├── Employees.vue
│   │   └── Payroll.vue
│   ├── router/            # Vue Router configuration
│   │   └── index.js
│   ├── composables/       # Vue composables
│   ├── App.vue           # Root component
│   └── main.js           # Application entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # TailwindCSS configuration
├── vite.config.js        # Vite configuration
└── README.md
```

## 🎯 Key Components

### Layout Components

- **DefaultLayout**: Main application layout with sidebar and top navigation
- **SidebarMenu**: Collapsible sidebar with navigation and theme toggle
- **TopNav**: Top navigation bar with search, notifications, and user menu

### Views

- **Dashboard**: Overview with metrics, charts, and quick actions
- **Employees**: Employee management with search, filters, and CRUD operations
- **Payroll**: Payroll processing and management interface

### Stores (Pinia)

- **Theme Store**: Manages dark/light mode and sidebar state
- **Auth Store**: Handles user authentication and profile management

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

### Adding New Routes

1. Create a new view component in `src/views/`
2. Add the route to `src/router/index.js`
3. Update the sidebar menu in `src/components/layout/SidebarMenu.vue`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Lucide for the beautiful icon set
- The open-source community for inspiration and tools

---

**Built with ❤️ using Vue 3, Vite, and TailwindCSS**