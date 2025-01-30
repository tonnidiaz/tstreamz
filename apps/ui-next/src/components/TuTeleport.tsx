
import ReactDOM from 'react-dom';

interface TeleportProps {
  to: string | HTMLElement; // Target container to render children
  children: React.ReactNode; // Children to render inside the target container
}

const TuTeleport: React.FC<TeleportProps> = ({ to, children }) => {
  // Determine the target element to render the children into
  const targetElement = typeof to === 'string' ? document.querySelector(to) : to;

  if (!targetElement) {
    console.error('Target element for Teleport not found');
    return null;
  }

  return ReactDOM.createPortal(children, targetElement);
};

export default TuTeleport;
// export default TuTeleport;
