import { notifications } from "@mantine/notifications";
import axios from "axios";
export const baseUrl = "http://127.0.0.1:8000";

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
  setInWishList: React.Dispatch<React.SetStateAction<boolean>>
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
    // Fetch the user's wishlist
    const response = await axios.get("http://127.0.0.1:8000/api/wishlist/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      // Check if the audiobook exists in the wishlist
      const items = response.data.items || [];
      return items.some((item: any) => item.audiobook.id === audiobookId);
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return false; // Return false if there's an error
  }
};
