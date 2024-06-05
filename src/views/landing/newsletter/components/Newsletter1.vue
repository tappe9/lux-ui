<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const amazonUrl = ref("");
const manufacturer = ref("");
const deviceName = ref("");
const price = ref("");
const thumbnailUrl = ref("");
const loading = ref(false);
const message = ref("");

const fetchData = async () => {
  loading.value = true;
  if (!amazonUrl.value) {
    message.value = "Please enter an Amazon URL";
    loading.value = false;
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/scrape-amazon",
      { url: amazonUrl.value }
    );
    const data = response.data;
    manufacturer.value = data.manufacturer;
    deviceName.value = data.deviceName;
    price.value = data.price;
    thumbnailUrl.value = data.thumbnailUrl;
  } catch (error) {
    console.error("Error fetching data:", error);
    message.value = "Error fetching data";
  }
  loading.value = false;
};

const saveData = async () => {
  if (
    !manufacturer.value ||
    !deviceName.value ||
    !price.value ||
    !thumbnailUrl.value
  ) {
    message.value = "Please fill in all fields";
    return;
  }
  loading.value = true;
  try {
    const response = await axios.post("http://localhost:5000/api/save-device", {
      amazonUrl: amazonUrl.value,
      manufacturer: manufacturer.value,
      deviceName: deviceName.value,
      price: price.value,
      thumbnailUrl: thumbnailUrl.value,
    });
    console.log("Data saved:", response.data);
    message.value = "Data saved successfully";
  } catch (error) {
    console.error("Error saving data:", error);
    message.value = "Error saving data";
  }
  loading.value = false;
  clearValues();
};
const clearValues = () => {
  manufacturer.value = "";
  deviceName.value = "";
  price.value = "";
  thumbnailUrl.value = "";
};
</script>

<template>
  <v-toolbar height="60">
    <v-toolbar-title class="text-h6 font-weight-bold">
      <span>Add Amazon Device</span>
    </v-toolbar-title>
  </v-toolbar>

  <v-sheet
    elevation="0"
    class="mx-auto landing-warpper"
    color="#F2F5F8"
    rounded
  >
    <v-sheet
      color="transparent"
      elevation="0"
      max-width="1600"
      class="mx-auto pa-5"
    >
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" lg="3">
            <h1 class="text-h5 font-weight-bold text-left">Input URL</h1>
            <p>メーカ、デバイス名、価格、サムネイル画像URLを取得する</p>
          </v-col>
          <v-col cols="12" sm="9" md="7">
            <v-text-field
              color="primary"
              hide-details
              variant="outlined"
              placeholder="urlを入力してください"
              v-model="amazonUrl"
              @keyup.enter="fetchData"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="2">
            <v-btn
              size="x-large"
              block
              color="primary font-weight-bold"
              @click="fetchData"
              :loading="loading"
              >Scraping</v-btn
            >
          </v-col>
        </v-row>
        <v-row v-if="manufacturer || deviceName || price || thumbnailUrl">
          <v-col cols="12" sm="6">
            <v-text-field
              label="メーカー"
              v-model="manufacturer"
              variant="outlined"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="デバイス名"
              v-model="deviceName"
              variant="outlined"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="価格"
              v-model="price"
              variant="outlined"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="サムネイルURL"
              v-model="thumbnailUrl"
              variant="outlined"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-img
              v-if="thumbnailUrl"
              :src="thumbnailUrl"
              alt="Thumbnail"
              max-width="200"
            ></v-img>
          </v-col>
          <v-col cols="12">
            <v-btn
              size="x-large"
              block
              color="primary font-weight-bold"
              @click="saveData"
              :loading="loading"
              >DBへ登録</v-btn
            >
          </v-col>
        </v-row>
        <br />
        <br />
        <template v-if="message">
          <v-alert
            v-if="message"
            :value="true"
            type="info"
            dismissible
            elevation="2"
          >
            {{ message }}
          </v-alert>
        </template>
      </v-container>
    </v-sheet>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
