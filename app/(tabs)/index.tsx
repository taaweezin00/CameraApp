import React, { useState } from 'react';
import { View } from 'react-native';
import CameraView from '../components/CameraView';

export default function CameraScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <CameraView photoUri={photoUri} setPhotoUri={setPhotoUri} />
    </View>
  );
}
