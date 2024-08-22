import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, View, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { theme } from "./theme";
import  React,{useState, useCallback,useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { debounce } from "lodash";
import { fetchLocations } from "./api/weather"
import { fetchWeatherForecast } from "./api/weather"
// import React, { useEffect, useState } from 'react';
export default function App() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const handleLocation = (loc) => {
    console.log('Location: ', loc);
    setLocations([]);
    toggleSearch(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setWeather(data);
      console.log('got forecast: ', data);
    });
  }
  // useEffect(()=>{
  //   fetchMyWeatherData();
  // },[]);
  const fetchMyWeatherData=async()=>{
    fetchWeatherForecast(
      {
        cityName:"Ho Chi Minh",
        days:7
      }
    ).then(data=>{
      setWeather(data);
    })
  }
  const handleSearch = value => {
    // fetch locations
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then(data => {
        console.log('got locations: ', data);
        setLocations(data);
      });
    }
  }
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;
  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image blurRadius={70} source={require('./assets/bg.png')}
        className="absolute h-full w-full"

      />
      <SafeAreaView className="flex flex-1 mt-16 ">
        <View style={{ height: '10%' }} className="mx-4 relative ">
          <View className="flex-row justify-end items-center rounded-full"
            style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}
          >{
              showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder='Search city'
                  placeholderTextColor={'lightgray'}
                  className="text-left p-2 pl-6 h-10 flex-1 text-base text-white"
                />
              ) : null


            }



            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{ backgroundColor: theme.bgWhite(0.3) }}
              className="rounded-3xl p-3 m-1"
            >
              <Icon name="search" size={15} color="white" />
            </TouchableOpacity>
          </View>
          {
            locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl z-50">{
                locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index} className={"flex-row items-center border-0 p-3 px-4 mb-1" + borderClass}>
                      <Icon name="map-marker" size={20} color="white" />
                      <Text >{loc?.name},{loc?.country}</Text>
                    </TouchableOpacity>
                  )
                })
              }
              </View>
            ) : null


          }
        </View>
        {/*forecast section*/}
        <View className="mx-4 flex justify-around flex-1 mb-2">
          {/*location*/}
          <Text className="text-white text-center text-2xl font-bold">
            {location?.name},
            <Text className="text-lg font-semibold text-gray-300">
              {"" + location?.country}
            </Text>
          </Text>
          {/*weather image*/}
          <View className="flex-grow justify-center m-auto text-center mt-1">
            <Image
              source={{ uri: 'https:' + current?.condition?.icon }}
              className="w-52 h-52"
            />
          </View>
          {/*degree celcius*/}
          <View className="space-y-2  ">
            <Text className="text-center font-bold text-white text-7xl ml-5 ">
              {current?.temp_c}&#176;
            </Text>
            <Text className="text-center font-bold text-white text-xl tracking-widest">
              {current?.condition.text}
            </Text>
          </View>
          {/*other stats*/}
          <View className="flex-row justify-between mx-4 mt-10">
            <View className="flex-row space-x-2 items-center">
              <Image source={require('./assets/wind.png')}
                className="h-6 w-6" />
              <Text className="text-white font-semibold text-base">
                {current?.wind_kph}km
              </Text>


            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={require('./assets/drop.png')}
                className="h-6 w-6" />
              <Text className="text-white font-semibold text-base">
                {current?.humidity}%
              </Text>


            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={require('./assets/cloud.png')}
                className="h-6 w-6" />
              <Text className="text-white font-semibold text-base">
                6:05 AM
              </Text>


            </View>
          </View>
          {/*next day*/}
          <View className="mb-2 space-y-10">
            {/* forecast for next days */}
            <View className="flex-row items-center mx-5 space-x-2 mt-10">
              <Icon name="calendar" size={15} color="white" />
              <Text className="text-white text-base">Daily forecast</Text>
            </View>

            <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 1 }}
              showsHorizontalScrollIndicator={false}


            >
              {
                weather?.forecast?.forecastday?.map((item, index) => {
                  let date = new Date(item.date);
                  let options = { weekday: 'long' };
                  let dayName = date.toLocaleDateString('en-US', options);
                  dayName = dayName.split(',')[0];

                  return (
                    <View
                      key={index}
                      className="flex justify-center items-center w-24 h-28 rounded-3xl py-3 space-y-1 mr-2"
                      style={{ backgroundColor: theme.bgWhite(0.15) }}
                    >
                      <Image source={{ uri: 'https:' + item?.day?.condition?.icon }} className="h-11 w-11" />
                      <Text className="text-white">{dayName}</Text>
                      <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>
                    </View>
                  );
                })
              }
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
