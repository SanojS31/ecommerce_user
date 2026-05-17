export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}