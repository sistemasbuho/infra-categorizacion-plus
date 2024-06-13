function CategorizationModal({ coords }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: coords.modalPosition.top,
        left: coords.modalPosition.left,
      }}
    ></div>
  );
}

export default CategorizationModal;
