import AccountSetting from "@/components/pages/AccountSetting";
import withProtected from "@/routes/withProtected";

// This is a setting page where AccountSetting component is rendered.
const Setting = () => <AccountSetting />;

export default withProtected(Setting);
