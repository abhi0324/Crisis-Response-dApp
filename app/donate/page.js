import Header from '../../components/Header';
import DonationForm from '../../components/DonationForm';

export default function DonatePage() {
  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Support Crisis Relief
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your donation helps provide immediate assistance to those affected by crises. 
            All donations are transparent and tracked on the blockchain.
          </p>
        </div>

        <DonationForm />
      </main>
    </div>
  );
} 