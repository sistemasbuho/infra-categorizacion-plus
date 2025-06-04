import { TagProvider } from './context/TagContext';
import TagLayout from './TagLayout';

function TagManager() {
  return (
    <>
      <TagProvider>
        <TagLayout />
      </TagProvider>
    </>
  );
}

export default TagManager;
