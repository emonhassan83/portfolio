import Link from 'next/link';
import Sidebar from '../components/Dashboard/Sidebar/Sidebar';
import { useGetMeQuery } from '../redux/features/auth/authApi';

const DashboardLayout = ({ children }) => {
  const { data } = useGetMeQuery();
  const needsTwoFactor = data?.data && !data.data.twoFactorEnabled;

  return (
    <div className='relative min-h-screen'>
      <Sidebar/>
      <div className='md:ml-64'>
        <div className='p-5 lg:p-8'>
          {needsTwoFactor && (
            <div role='status' className='alert mb-5 border border-warning/40 bg-warning/10 text-sm text-base-content'>
              <span>
                Two-factor authentication is off. Add an authenticator app so a stolen password alone cannot open the dashboard.
              </span>
              <Link href='/dashboard/security' className='btn btn-primary btn-sm'>
                Set it up
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout;
