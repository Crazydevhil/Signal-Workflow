import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glow-bg" />
      
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Signal Workflows
          </Link>
        </div>
        
        <AuthForm />
      </div>
    </main>
  );
}
