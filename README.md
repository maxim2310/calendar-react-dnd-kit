# Calendar Task Management Application

This project is a **Calendar Grid Application** with functionality to create, edit, and organize tasks. The calendar supports drag-and-drop interactions, inline task management, search functionality, and displays worldwide holidays. This project was built using **React**, **TypeScript**, and **Vite**.

---

## **Features**

- **Inline Task Management:** Create and edit tasks directly within calendar cells.
- **Drag and Drop:**
  - Reassign tasks between different days.
  - Reorder tasks within the same day.
- **Task Filtering:** Search and filter tasks by text.
- **Worldwide Holidays:**
  - Displays global holidays for each day using the [Nager.Date API](https://date.nager.at/swagger/index.html).
  - Holidays are fixed at the top of each cell and are not draggable or re-orderable.

---

## **Getting Started**

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to view the application.

---

## **Project Structure**

```
.
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── services/          # API services and helper functions
│   ├── models/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application entry point
│   └── main.tsx           # React DOM rendering with Vite
├── .eslint.config           # ESLint configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Project metadata and scripts
```

---

## **API Integration**

This project integrates with the [Nager.Date API](https://date.nager.at/swagger/index.html) to fetch global holidays.

### Example Usage

```typescript
const API_BASE_URL = 'https://date.nager.at/Api/v2';

export const fetchHolidays = async (year: number, countryCode: string) => {
  const response = await fetch(`${API_BASE_URL}/PublicHolidays/${year}/${countryCode}`);
  if (!response.ok) {
    throw new Error('Failed to fetch holidays');
  }
  return response.json();
};
```

---

## **Available Scripts**

### `npm run dev`

Runs the app in the development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production into the `dist` folder.

### `npm run preview`

Locally previews the production build.

### `npm run lint`

Lints the codebase for potential issues and enforces coding standards.

---

---

## **Technologies Used**

- **React**: For building the user interface.
- **TypeScript**: For type safety and better development experience.
- **Vite**: For fast build and development environment.
- **CSS-in-JS**: For styling components.
- **Fetch API**: For API requests.

---
