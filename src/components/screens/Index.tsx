import { Dialog } from '@headlessui/react';
import { useRef, useState, useEffect } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { SignOutButton } from '~/components/domain/auth/SignOutButton';
import { Head } from '~/components/shared/Head';
import { useFirestore } from "~/Lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";

type Tool = {
  id: string,
  title: string,
  description: string,
  url: string
}

function Index() {
  const { state } = useAuthState();
  const [tools, setTools] = useState<Array<Tool>>([]);
  const firestore = useFirestore();

  useEffect(() => {
    async function fetchData() {
      const toolsCollection = collection(firestore, "tools");
      const toolsQuery = query(toolsCollection);
      const querySnapshot = await getDocs(toolsQuery);
      const fetchedData: Array<Tool> = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data()} as Tool);
      })
      console.table(fetchedData);
      setTools(fetchedData);
    }
    fetchData();
  }, []);


  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {
                tools.map((tool) => {
                  <tr key={tool.id}>
                    <td>{tool.title}</td>
                    <td>{tool.description}</td>
                    <td>{tool.url}</td>
                  </tr>
                })
              }
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
}

export default Index;
