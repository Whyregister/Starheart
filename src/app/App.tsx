import { AppProvider } from "./AppContext";
import AppRoutes from "./routes";
import Layout from "../components/Layout/Layout";

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </AppProvider>
  );
}
