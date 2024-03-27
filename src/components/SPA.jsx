import {Route, Routes} from "react-router-dom";
import Templates from "./Templates.jsx";
import TemplatePages from "./TemplatePages.jsx";
import TemplateOptions from "./TemplateOptions.jsx";
import BulkMessages from "./BulkMessages.jsx";

export default function SPA() {
    return(
        <div className="container mt-4">
        <Routes>

            <Route path="/" element={<BulkMessages />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/template-pages" element={<TemplatePages />} />
            <Route path="/template-options" element={<TemplateOptions />} />

        </Routes>
        </div>
    );
}