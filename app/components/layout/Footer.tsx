export default function Footer() {
  return (
    <footer className="border-t bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center text-gray-600">
        <p className="font-medium text-gray-800 mb-2">Billify</p>

        <p className="text-sm">
          © {new Date().getFullYear()} Billify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
