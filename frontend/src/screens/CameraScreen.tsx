import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import type { CameraType, FlashMode } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import type { ScreenProps } from "../types";
import CameraStyle from "../styles/CameraStyle";


const exifToDecimal = (
  dms: number[],
  ref: "N" | "S" | "E" | "W"
) => {
  const [d, m, s] = dms;
  let dec = d + m / 60 + s / 3600;
  if (ref === "S" || ref === "W") dec *= -1;
  return dec;
};


const styles = CameraStyle;
export default function CameraScreen({
  navigation,
}: ScreenProps<"CameraScreen">) {
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOk, setIsCameraOk] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const requestLocationPermission = async () => {
      await Location.requestForegroundPermissionsAsync();
    };

    if (isMounted) {
      requestLocationPermission();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need camera permission.</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const ensureLocationPermission = async () => {
    const current = await Location.getForegroundPermissionsAsync();

    if (current.status === "granted") {
      return "granted";
    }

    if (current.canAskAgain) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status;
    }

    Alert.alert(
      "Location permission needed",
      "Enable location permission for Expo Go in system settings."
    );
    return current.status;
  };

  const handletheCapture = async () => {
    if (!cameraRef.current || !isCameraOk) return;
  
    // ✅ Capture image WITH exif (still not GPS-reliable)
    const photo = await cameraRef.current.takePictureAsync({
      quality: 1,
      exif: true,
    });
  
    // ✅ Location handled separately (correct)
    let location = null;
    const permissionStatus = await ensureLocationPermission();
    if (permissionStatus === "granted") {
      location = await Location.getCurrentPositionAsync({});
    }
  
    // ✅ Go DIRECTLY to confirmation screen
    navigation.navigate("CropScreen", {
      photo: {
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
        format: "jpg",
        exif: photo.exif, // ⚠️ partial EXIF (expected)
      },
      location,
    });
  };
  

  const handleGalleryPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery access is required.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });
  
    if (result.canceled) return;
  
    let location = null;
    const permissionStatus = await ensureLocationPermission();
    if (permissionStatus === "granted") {
      location = await Location.getCurrentPositionAsync({});
    }

    // Navigate to confirmation screen with gallery photo
    navigation.navigate("UploadConfirmationScreen", {
      photo:
        result.assets.length === 1
          ? ({
              uri: result.assets[0].uri,
              width: result.assets[0].width,
              height: result.assets[0].height,
            } as any)
          : undefined,
      photos: result.assets.map((asset) => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        name: asset.fileName || "photo.jpg",
        type: asset.mimeType || "image/jpeg",
      })),
      location,
    });
  };
  

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        onCameraReady={() => setIsCameraOk(true)}
      />

      {/* Top controls */}
      <View style={styles.topControls}>
        <TouchableOpacity onPress={toggleFlash} style={styles.topButton}>
          <Text style={styles.topButtonText}>
            ⚡ {flash === "on" ? "On" : "Off"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleCameraFacing} style={styles.topButton}>
          <Text style={styles.topButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom pill controls */}
      <View style={styles.bottomPill}>
        {/* Gallery preview */}
        <TouchableOpacity onPress={handleGalleryPick}>
          <View style={styles.galleryPreview}>
            <Text style={styles.previewText}>🖼️</Text>
          </View>
        </TouchableOpacity>

        {/* Capture button */}
        <TouchableOpacity onPress={handletheCapture}>
          <View style={styles.captureButton}>
            <Text style={styles.captureIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
          <View style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
