import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ExpertPage from "./pages/ExpertPage";
import AssessmentPage from "./pages/AssessmentPage";
import RankingManagementPage from "./pages/RankingManagementPage";
import RankingCreationPage from "./pages/RankingCreationPage";
import RankingOverviewPage from "./pages/RankingOverviewPage";
import AdminPage from "./pages/AdminPage";



function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/expert/:nickname" element={<ExpertPage />} />
            <Route path="/expert/:nickname/ranking/:ranking_id/assessment" element={<AssessmentPage />} />
            <Route path="/expert/:nickname/ranking/:ranking_id/manage" element={<RankingManagementPage />} />
            <Route path="/expert/:nickname/create_ranking" element={<RankingCreationPage />} />

            <Route path="/admin" element={<AdminPage />} />
            <Route path="/ranking/:id" element={<RankingOverviewPage />} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default Router;