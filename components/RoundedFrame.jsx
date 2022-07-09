export default function RoundedFrame({ children, ...props }) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden duration-200 shadow hover:md:shadow-md w-full"
      {...props}
    >
      {children}
    </div>
  );
}
