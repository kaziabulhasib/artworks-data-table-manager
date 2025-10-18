# Artwork Data Table

A React application featuring a dynamic data table with advanced row selection capabilities across multiple pages.

## Live Link

https://artworks-data-table-manager.netlify.app/

## Features

- **Server-side pagination** - Efficiently loads data from the Art Institute of Chicago API
- **Cross-page row selection** - Select any number of rows spanning multiple pages automatically
- **Dynamic selection input** - Choose exact number of rows to select via overlay panel
- **Responsive design** - Built with PrimeReact components for a modern UI
- **Real-time data fetching** - Lazy loading with progress indicators

## Tech Stack

- React
- TypeScript
- PrimeReact (DataTable, OverlayPanel, InputText, Button)
- Art Institute of Chicago API

## Installation

1. Clone the repository

```bash
git clone [your-repo-url]
cd [your-project-name]
```

2. Install dependencies

```bash
npm install
```

3. Install PrimeReact and PrimeIcons

```bash
npm install primereact primeicons
```

4. Start the development server

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

- Navigate through pages using the paginator
- Click the dropdown button to open the selection panel
- Enter the number of rows you want to select
- The app will automatically select rows across multiple pages if needed
