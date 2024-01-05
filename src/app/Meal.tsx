"use client";
import { useAtom, useAtomValue } from "jotai";
import { data } from "@/data/data";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { orderAtom, passengerAtom } from "@/lib/state";

export function Meal({ meal }: { meal: (typeof data.meals)[0] }) {
  const selectedPassenger = useAtomValue(passengerAtom);
  const [orders, setOrders] = useAtom(orderAtom);
  const [order, setOrder] = useState<{
    meal?: string;
    drink?: string;
    price: number;
  }>({ price: 0 });

  useEffect(() => {
    const existingUserIndex = orders.findIndex(
      (order) => order.name === selectedPassenger
    );

    if (existingUserIndex !== -1) {
      const updatedOrders = [...orders];
      updatedOrders[existingUserIndex] = {
        name: selectedPassenger,
        meal: order,
      };
      setOrders(updatedOrders);
    } else {
      setOrders([...orders, { name: selectedPassenger, meal: order }]);
    }
  }, [order]);

  const drinkPrice = () => {
    if (meal.drinks.find((drink) => drink.id === order.drink) !== undefined) {
      return meal.drinks.find((drink) => drink.id === order.drink)?.price!;
    } else return 0;
  };

  const mealPrice = meal.price + drinkPrice();

  return (
    <Grid
      display={"flex"}
      gap={4}
      padding={4}
      width={"100%"}
      sx={{ bgcolor: "white", borderRadius: "0.5rem" }}
      direction={{ md: "row", xs: "column" }}
    >
      <Grid key={meal.id} item height={200} width={{ xs: "auto", md: 200 }}>
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
      <Grid
        display={"flex"}
        flexDirection={"column"}
        height={"auto"}
        sx={{ flexGrow: 1 }}
      >
        <text>
          {meal.title} + {meal.drinks.length} drinks
        </text>
        <text>Name of the meal</text>
        <text>Starter: {meal.starter}</text>
        <text>Dessert: {meal.desert}</text>
        <text>
          Selected drink:{" "}
          {meal.drinks.find((drink) => drink.id === order.drink)?.title ||
            "Not Found"}
        </text>
        <Box gap={3} display={"flex"}>
          <Grid gap={1} display={"flex"}>
            {meal.drinks.map((drink) => {
              return (
                <Grid key={drink.id}>
                  <Chip
                    label={drink.title}
                    onClick={() => {
                      // setDrink(drink.id);
                      setOrder((meals) => ({
                        ...meals,
                        drink: drink.id,
                        price: meal.price + drink.price,
                      }));
                    }}
                    variant="outlined"
                    color={order.drink === drink.id ? "info" : "default"}
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
        alignSelf={"end"}
        justifySelf={"end"}
      >
        <text>Price: {mealPrice.toFixed(2)}</text>
        {/* <Button variant="outlined" onClick={handleMealSelection}>
              Select{" "}
            </Button> */}
        {orders.some(
          (existingOrder) =>
            existingOrder.name === selectedPassenger &&
            existingOrder.meal?.meal === meal.id
        ) ? (
          <Button
            variant="outlined"
            onClick={() =>
              setOrder({ meal: "", drink: meal.drinks[0].id, price: 0 })
            }
          >
            <span role="img" aria-label="Cross">
              ❌
            </span>{" "}
            Deselect
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() =>
              setOrder({
                ...order,
                meal: meal.id,
                price: mealPrice,
                drink: order.drink ? order.drink : meal.drinks[0].id,
              })
            }
          >
            Select
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
