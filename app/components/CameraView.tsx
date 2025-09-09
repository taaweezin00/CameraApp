import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

interface CameraViewProps {
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
}

type CameraType = 'back' | 'front';
type FlashMode = 'off' | 'on'; // เอา 'auto' ออกแล้ว

export default function CameraComponent({ photoUri, setPhotoUri }: CameraViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== 'granted') {
        alert('ต้องการสิทธิ์ในการเข้าถึงสื่อเพื่อบันทึกรูปภาพ');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        alert('เกิดข้อผิดพลาดในการถ่ายภาพ');
      }
    }
  };

  const savePhoto = async () => {
    if (photoUri) {
      try {
        await MediaLibrary.saveToLibraryAsync(photoUri);
        alert('บันทึกแล้ว!');
        setPhotoUri(null);
      } catch (error) {
        console.error('Error saving photo:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกภาพ');
      }
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    // สลับระหว่าง off กับ on เท่านั้น
    setFlash(current => current === 'off' ? 'on' : 'off');
  };

  const getFlashText = () => {
    switch (flash) {
      case 'off': return '⚡️ปิด';
      case 'on': return '⚡️เปิด';
      default: return '⚡️ปิด';
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>ต้องการสิทธิ์ในการใช้งานกล้อง</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>ให้สิทธิ์</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.button} onPress={savePhoto}>
              <Text style={styles.text}>บันทึก</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setPhotoUri(null)}>
              <Text style={styles.text}>ถ่ายใหม่</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <CameraView
            style={styles.camera}
            facing={type}
            flash={flash}
            ref={cameraRef}
          />
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraType}
            >
              <Text style={styles.text}>สลับกล้อง</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.captureButton]} onPress={takePicture}>
              <Text style={styles.text}>📸</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={toggleFlash}
            >
              <Text style={styles.text}>
                {getFlashText()}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  camera: { 
    flex: 1, 
    width: '100%' 
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  button: { 
    padding: 15, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 50,
    minWidth: 80,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#fff',
    padding: 20,
  },
  text: { 
    color: '#fff',
    fontWeight: 'bold',
  },
  preview: { 
    flex: 1, 
    width: '100%' 
  },
});