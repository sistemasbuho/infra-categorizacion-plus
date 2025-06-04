import { TemaProvider } from './context/TemaContext';
import TemaLayout from './TemaLayout';

function TemaManager() {
  return (
    <>
      <TemaProvider>
        <TemaLayout />
      </TemaProvider>
    </>
  );
}

export default TemaManager;
