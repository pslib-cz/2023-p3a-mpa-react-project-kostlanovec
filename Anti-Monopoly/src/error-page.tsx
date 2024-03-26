import { useLocation } from "react-router-dom";
import { ReactElement } from "react";

const ErrorPage = (): ReactElement => {
    const location = useLocation();
    const error: string | null = location.state?.error;

    return (
        <div id="error-page">
            <h1>{error} stránka</h1>
            <p>Náš server neumí cítit pocity, ale mrzí ho to.</p>
        </div>
    );
}

export default ErrorPage;
