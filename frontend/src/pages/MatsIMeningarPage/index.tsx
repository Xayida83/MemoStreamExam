import React, { useEffect, useState } from 'react';
import { Customer } from '../../types/Customer';


export const MatsIMeningarPage = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [entrys, setEntrys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const customerRes = await fetch('/api/customers/matsimeningar');
      setCustomer(await customerRes.json());
      
      const entrysRes = await fetch('/api/emails/matsimeningar');
      setEntrys(await entrysRes.json());
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Laddar...</div>;
  if (!customer) return <div className="text-center py-8">Ingen sida hittad</div>;

  const latestThree = entrys.slice(0, 3);
  const latest = entrys[0];

  return (
    <div className="max-w-md mx-auto p-2 font-serif bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{customer.name}</h1>
    </div>
  );
}; 