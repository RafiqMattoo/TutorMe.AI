import { Route } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";
import RegistrationPage from "../../features/auth/pages/RegistrationPage";
import VerificationEmailSentPage from "../../features/auth/pages/VerificationEmailSentPage";
import VerificationSuccessPage from "../../features/auth/pages/VerificationSuccessPage";
import VerificationLinkExpiredPage from "../../features/auth/pages/VerificationLinkExpiredPage";

export const publicRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
  
    <Route path="/register" element={<RegistrationPage />} />
    <Route
      path="/email-verification-sent"
      element={<VerificationEmailSentPage />}
    />
    <Route path="/email-verified" element={<VerificationSuccessPage />} />
    <Route
      path="/email-verification-expired"
      element={<VerificationLinkExpiredPage />}
    />
  </>
);
