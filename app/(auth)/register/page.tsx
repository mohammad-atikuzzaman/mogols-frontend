import RegisterForm from "../../../components/auth/RegisterForm";

export default function Register() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 py-12 lg:px-8 font-sans">
            <RegisterForm />
        </div>
    );
}
