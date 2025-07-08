import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Props {
  isLoading: boolean;
}

function Loader({ isLoading }: Props): React.ReactElement {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black bg-opacity-50
        transition-opacity duration-300
        ${
          isLoading
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }
      `}
    >
      <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-white" />
    </div>
  );
}

export default Loader;
