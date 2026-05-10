import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
  const {
    userName, phoneNumber, profilePhoto, address, experience,
    setUserName, setProfilePhoto, setAddress, setExperience,
  } = useApp();
  const router = useRouter();

  const [name, setName] = useState(userName);
  const [addr, setAddr] = useState(address);
  const [exp, setExp] = useState(experience);
  const [photo, setPhoto] = useState<string | null>(profilePhoto);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      Haptics.selectionAsync();
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow camera access to take a profile picture.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      Haptics.selectionAsync();
    }
  };

  const showPhotoOptions = () => {
    Alert.alert('Profile Photo', 'Choose an option', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Gallery', onPress: pickImage },
      ...(photo ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: () => setPhoto(null) }] : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setUserName(name.trim() || 'Worker');
      await setProfilePhoto(photo);
      await setAddress(addr.trim());
      await setExperience(exp.trim());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Photo */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.photoSection}>
          <TouchableOpacity onPress={showPhotoOptions} style={styles.photoContainer}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.profileImage} contentFit="cover" />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={48} color={Colors.primary + '60'} />
              </View>
            )}
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={18} color={Colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>Tap to change photo</Text>
        </Animated.View>

        {/* Form Fields */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.formSection}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          {/* Phone (read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <Ionicons name="call-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.disabledText}>+91 {phoneNumber || 'XXXXXXXXXX'}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address / Location</Text>
            <View style={[styles.inputContainer, styles.inputMultiline]}>
              <Ionicons name="location-outline" size={20} color={Colors.textSecondary} style={{ marginTop: 2 }} />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={addr}
                onChangeText={setAddr}
                placeholder="Enter your city, district, or full address"
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Experience */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Work Experience</Text>
            <View style={[styles.inputContainer, styles.inputMultiline]}>
              <Ionicons name="briefcase-outline" size={20} color={Colors.textSecondary} style={{ marginTop: 2 }} />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={exp}
                onChangeText={setExp}
                placeholder="e.g., 5 years in construction, 2 years as electrician"
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Save Button */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  photoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    position: 'relative',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  photoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadows.small,
  },
  photoHint: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  formSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 18,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
    ...Shadows.small,
  },
  inputDisabled: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
  },
  inputMultiline: {
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  disabledText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textMuted,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 28,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Shadows.medium,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadows.small,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});
