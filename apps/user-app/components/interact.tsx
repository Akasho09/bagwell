export function Interact() {
  return (
      <div className="h-16 w-full flex items-center gap-6 px-6 bg-green-800 text-white">
        <button className="hover:underline">
          👍 Like
        </button>

        <button className="hover:underline">
          💬 Comment
        </button>

        <button className="hover:underline">
          👎 Dislike
        </button>

        <button className="hover:underline">
          ⭐ Add to Wishlist
        </button>
    </div>
  );
}
