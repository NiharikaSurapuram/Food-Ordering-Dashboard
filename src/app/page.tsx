"use client";
import Image from "next/image";
import { atom, useAtom, useAtomValue } from "jotai";

import Divider from "@mui/material/Divider";
import { data } from "@/data/data";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { orderAtom, passengerAtom } from "@/lib/state";

export default function Home() {
  const [filter, setFilter] = useState<string>("all");
  const [passengerOrder, setPassengerOrder] = useAtom(orderAtom);
  const [selectedPassenger, setPassenger] = useAtom(passengerAtom);

  return (
    <Box padding="4rem" sx={{ bgcolor: "#424242" }} minHeight={"100vh"}>
      <Container>
        <Grid container gap={2} display={"flex"}>
          <Grid xs={8} gap={2} display={"flex"} flexDirection={"column"}>
            <Box padding={2} sx={{ bgcolor: "white", borderRadius: "0.5rem" }}>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="All"
                  onClick={() => {
                    setFilter("all");
                  }}
                  variant="outlined"
                  color={filter === "all" ? "info" : "default"}
                ></Chip>

                {data.labels.map((label) => {
                  return (
                    <Chip
                      label={label.label}
                      onClick={() => {
                        setFilter(label.id);
                      }}
                      variant="outlined"
                      color={filter === label.id ? "info" : "default"}
                    />
                  );
                })}
              </Stack>
            </Box>

            <Box>
              <Grid container gap={2}>
                {data.meals
                  .filter((meal) =>
                    filter === "all" ? true : meal.labels.includes(filter)
                  )
                  .map((meal) => (
                    <Meal meal={meal}></Meal>
                  ))}
              </Grid>
            </Box>
          </Grid>

          <Grid
            xs={3}
            sx={{ bgcolor: "white", borderRadius: "0.5rem" }}
            padding={4}
          >
            <List>
              {passengerOrder.map((passenger) => {
                return (
                  <ListItemButton
                    selected={selectedPassenger === passenger.name}
                    onClick={() => setPassenger(passenger.name)}
                  >
                    {/* <ListItemText primary={passenger.name} /> */}
                    <Box justifyContent={"space-between"}>
                      <Box>{passenger.name}</Box>
                      <Box>
                        {passenger.meal ? "Meal selected" : "Not selected"}
                      </Box>
                      <Box>Price:{passenger.meal?.price.toPrecision(4)}</Box>
                    </Box>
                  </ListItemButton>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function Meal({ meal }: { meal: (typeof data.meals)[0] }) {
  const [selectedDrink, setDrink] = useState<string>("drink-1");
  const selectedPassenger = useAtomValue(passengerAtom);
  const [orders, setOrders] = useAtom(orderAtom);
  const [meals, setMeals] = useState({
    meal: meal.id,
    drink: meal.drinks[0].id,
    price: meal.price + meal.drinks[0].price,
  });
  const handleMealSelection = () => {
    const existingUserIndex = orders.findIndex(
      (order) => order.name === selectedPassenger
    );

    if (existingUserIndex !== -1) {
      const updatedOrders = [...orders];
      updatedOrders[existingUserIndex] = {
        name: selectedPassenger,
        meal: meals,
      };
      setOrders(updatedOrders);
    } else {
      setOrders([...orders, { name: selectedPassenger, meal: meals }]);
    }
  };

  return (
    <Grid
      display={"flex"}
      gap={4}
      padding={4}
      width={"100%"}
      sx={{ bgcolor: "white", borderRadius: "0.5rem" }}
    >
      <Grid key={meal.id} item xs={4} height={200}>
        <img
          src={meal.img}
          alt={meal.id}
          style={{
            objectFit: "cover",
            height: "100%",
            width: "100%",
          }}
        />
      </Grid>
      <Grid xs={6} display={"flex"} flexDirection={"column"}>
        <text>
          {meal.title} + {meal.drinks.length} drinks
        </text>
        <text>Name of the meal</text>
        <text>Starter: {meal.starter}</text>
        <text>Dessert: {meal.desert}</text>
        <text>
          Selected drink:{" "}
          {meal.drinks.find((drink) => drink.id === selectedDrink)?.title ||
            "Not Found"}
        </text>
        <Box gap={3} display={"flex"}>
          <Grid gap={1} display={"flex"}>
            {meal.drinks.map((drink) => {
              return (
                <Grid>
                  <Chip
                    label={drink.title}
                    onClick={() => {
                      setDrink(drink.id);
                      setMeals((meals) => ({
                        ...meals,
                        drink: drink.id,
                        price: meal.price + drink.price,
                      }));
                    }}
                    variant="outlined"
                    color={selectedDrink === drink.id ? "info" : "default"}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Grid>
      <Grid
        gap={3}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"end"}
        justifyContent={"end"}
        xs={2}
      >
        <text>
          Price:{" "}
          {(
            meal.price +
            meal.drinks.find((drink) => drink.id === selectedDrink)?.price!
          ).toPrecision(4)}
        </text>
        <Button variant="outlined" onClick={handleMealSelection}>
          Select{" "}
        </Button>
      </Grid>
    </Grid>
  );
}
