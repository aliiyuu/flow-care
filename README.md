## Getting Started

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd triage-flow-care
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

- **src/app/dashboard/page.tsx**: Comprehensive dashboard with analytics, patient management, and key metrics visualization.
- **src/app/triage/page.tsx**: Provides a user interface for inputting patient data and displays the priority queue for triage.
- **src/components**: Contains reusable UI components such as buttons, cards, inputs, and modals.
- **src/lib**: Implements the priority queue data structure and triage algorithms.
- **src/hooks**: Custom hooks for managing patient data and analytics.
- **src/types**: TypeScript interfaces for patient and queue structures.

## Features

- User input for patient data including name, condition, and priority.
- Dynamic display of patient queue and triage order.
- Comprehensive dashboard with real-time analytics, charts, and key metrics.
- PDF export functionality for analytics reports and dashboard data.
- Patient addition via modal popup interface.
- Visualizations and statistics for better decision-making in disaster relief scenarios.

## Deployment

For deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

To learn more about Next.js and its features, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

Your feedback and contributions are welcome!