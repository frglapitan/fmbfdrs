import { Routes, Route } from "react-router-dom";
//import DynamicMap from "../components/map_component/DynamicMap";
import NoPage from "./NoPage";
import PublicHeader from "../components/layouts/PublicHeader";
//import PublicFooter from "../components/layouts/PublicFooter";
import FireIndexMap from "../components/map_component/FireIndexMap";

const PublicPage = () => {
    return (
        <>
            <PublicHeader />
            <Routes>
            
                <Route index element={<FireIndexMap />} />
                <Route path="/fire_index" element={<FireIndexMap />} />
                <Route path="*" element={<NoPage />} />
            
            </Routes>
            {/*}
            <PublicFooter />
            {*/}
        </>
    )
}

export default PublicPage;