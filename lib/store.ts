import { FavoriteItem } from "@/app/favorites/page";
import { WishlistItem } from "@/app/wishlist/page";
import { PurchaseStatus } from "@/types/types";
import { notifications } from "@mantine/notifications";
import axios from "axios";
export const baseUrl = "http://127.0.0.1:8000";

export const addToFavorites = async (
  audiobookId: number,
  token: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setInFavorites: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/add/`,
      {
        audiobook_id: audiobookId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      setInFavorites(true);
      notifications.show({
        title: "Success",
        message: "Audiobook added to favorites",
        color: "green",
        position: "top-right",
      });
    }
  } catch (error: any) {
    console.error("Error adding to favorites:", error);
    notifications.show({
      title: "Error",
      message: error.response?.data?.message || "Failed to add to favorites",
      color: "red",
      position: "top-right",
    });
  } finally {
    setLoading(false);
  }
};

export const removeFromFavorites = async (
  audiobookId: number,
  token: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setInFavorites: React.Dispatch<React.SetStateAction<boolean>>,
  setFavoriteItems: React.Dispatch<React.SetStateAction<FavoriteItem[] | null>>,
  from: string
) => {
  try {
    setLoading(true);
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/remove/${audiobookId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 204) {
      // Changed to check for 204 status
      setInFavorites(false);
      if (from === "favorites") {
        setFavoriteItems(
          (prev) =>
            prev?.filter((item) => item.audiobook.id !== audiobookId) || null
        );
      }
      notifications.show({
        title: "Success",
        message: "Audiobook removed from favorites",
        color: "green",
        position: "top-right",
      });
    }
  } catch (error: any) {
    console.error("Error removing from favorites:", error);
    notifications.show({
      title: "Error",
      message:
        error.response?.data?.message || "Failed to remove from favorites",
      color: "red",
      position: "top-right",
    });
  } finally {
    setLoading(false);
  }
};

export const addToWishlist = async (
  audiobookId: number,
  token: string,
  setAddWishLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setInWishList: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setAddWishLoading(true);
    const response = await axios.post(
      "http://127.0.0.1:8000/api/wishlist/add/",
      { audiobook_id: audiobookId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      setInWishList(true);
      notifications.show({
        title: "Success",
        message: "Audiobook added to wishlist",
        color: "green",
        position: "top-right",
      });
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to add audiobook to wishlist",
        color: "red",
        position: "top-right",
      });
      return;
    }
  } catch (err) {
    console.error("Error adding to wishlist", err);
    notifications.show({
      title: "Error",
      message: "Failed to add audiobook to wishlist",
      color: "red",
      position: "top-right",
    });
  } finally {
    setAddWishLoading(false);
  }
};

export const removeFromWishlist = async (
  audiobookId: number,
  token: string,
  setRemoveWishLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setInWishList: React.Dispatch<React.SetStateAction<boolean>>,
  setWishlistItems: React.Dispatch<React.SetStateAction<WishlistItem[] | null>>,
  from: string
) => {
  try {
    setRemoveWishLoading(true);
    // Make a DELETE request to remove the audiobook from the wishlist
    const response = await axios.delete(
      `http://127.0.0.1:8000/api/wishlist/remove/${audiobookId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 204) {
      setInWishList(false);
      if (from === "wishlist") {
        setWishlistItems(
          (prev) =>
            prev?.filter((item) => item.audiobook.id !== audiobookId) || null
        );
      }
      notifications.show({
        title: "Success",
        message: "Audiobook removed from wishlist",
        color: "green",
        position: "top-right",
      });
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to remove audiobook from wishlist",
        color: "red",
        position: "top-right",
      });
      return;
    }
  } catch (err) {
    console.error("Error removing from wishlist", err);
    notifications.show({
      title: "Error",
      message: "Failed to remove audiobook from wishlist",
      color: "red",
      position: "top-right",
    });
  } finally {
    setRemoveWishLoading(false);
  }
};

export const checkAudiobookInWishlist = async (
  audiobookId: number,
  token: string
) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/wishlist/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const items = response.data.items || [];
      return items.some((item: any) => item.audiobook.id === audiobookId);
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return false;
  }
};

export const checkAudiobookInFavorites = async (
  audiobookId: number,
  token: string
): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const items = response.data.items || [];
      return items.some((item: any) => item.audiobook.id === audiobookId);
    }
    return false;
  } catch (error) {
    console.error("Error checking favorites status:", error);
    return false;
  }
};

export const fetchFavorites = async (token?: string) => {
  if (!token) {
    throw new Error("Authentication token is required to fetch favorites.");
  }
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/favorites/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.items;
    } else {
      throw new Error("Failed to fetch favorites.");
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

export const fetchWishlist = async (token: string | undefined) => {
  if (!token) {
    throw new Error("Authentication token is required to fetch the wishlist.");
  }

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/wishlist/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.items;
    } else {
      throw new Error("Failed to fetch wishlist.");
    }
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    throw new Error("An error occurred while fetching the wishlist.");
  }
};

export const checkPurchaseStatus = async (
  audiobookId: number,
  jwt: string
): Promise<PurchaseStatus | null> => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/purchases/check-purchase-status/${audiobookId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch purchase status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching purchase status:", error);
    return null;
  }
};
