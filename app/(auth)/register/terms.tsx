import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import STYLES from "@/constants/styles";
import { Text } from "react-native-paper";


const TermsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <AuthScreenLayout title="Terms And Conditions" isScrollable={true}>

      <View style={STYLES.infoContainer}>

        <Text variant="bodyMedium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quas architecto vero, inventore corrupti magnam animi qui quasi, nemo odio assumenda minus accusamus, perferendis molestiae saepe consectetur similique provident nisi nulla aut explicabo necessitatibus. Neque odit temporibus corporis maiores ea reiciendis, asperiores voluptates possimus autem distinctio quod eius, repudiandae qui harum consequatur, quo debitis nihil. Temporibus illum officiis quibusdam ullam deleniti similique ratione quos veniam quae nostrum aliquam aperiam incidunt fugit consequuntur magnam sit quas numquam at soluta neque, sequi beatae vel! Cupiditate rerum voluptas laboriosam placeat labore dolorem odit sapiente, perferendis possimus magnam dolore deserunt eum nam fuga ab?</Text>
        
        <Text variant="bodyMedium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quas architecto vero, inventore corrupti magnam animi qui quasi, nemo odio assumenda minus accusamus, perferendis molestiae saepe consectetur similique provident nisi nulla aut explicabo necessitatibus. Neque odit temporibus corporis maiores ea reiciendis, asperiores voluptates possimus autem distinctio quod eius, repudiandae qui harum consequatur, quo debitis nihil. Temporibus illum officiis quibusdam ullam deleniti similique ratione quos veniam quae nostrum aliquam aperiam incidunt fugit consequuntur magnam sit quas numquam at soluta neque, sequi beatae vel! Cupiditate rerum voluptas laboriosam placeat labore dolorem odit sapiente, perferendis possimus magnam dolore deserunt eum nam fuga ab?</Text>

        <Text variant="bodyMedium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quas architecto vero, inventore corrupti magnam animi qui quasi, nemo odio assumenda minus accusamus, perferendis molestiae saepe consectetur similique provident nisi nulla aut explicabo necessitatibus. Neque odit temporibus corporis maiores ea reiciendis, asperiores voluptates possimus autem distinctio quod eius, repudiandae qui harum consequatur, quo debitis nihil. Temporibus illum officiis quibusdam ullam deleniti similique ratione quos veniam quae nostrum aliquam aperiam incidunt fugit consequuntur magnam sit quas numquam at soluta neque, sequi beatae vel! Cupiditate rerum voluptas laboriosam placeat labore dolorem odit sapiente, perferendis possimus magnam dolore deserunt eum nam fuga ab?</Text>

        {/* Submit Button */}
        <ActionPrimaryButton
          buttonTitle="Continue"
          onSubmit={() => router.back()}
        />

      </View>

    </AuthScreenLayout>
  );
};

export default TermsScreen;