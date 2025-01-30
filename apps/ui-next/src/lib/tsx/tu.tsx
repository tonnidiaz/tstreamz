import React from "react";

export // HOC to add `bind:<prop_name>` support
function withBind<T extends object>(
  Component: React.ComponentType<T>
): React.FC<T & { [key: `bind:${string}`]: any }> {
  return (props) => {
    const newProps: any = { ...props };

    // Process `bind:<prop_name>` props
    Object.keys(props).forEach((key) => {
      if (key.startsWith("bind:")) {
        const propName = key.slice(5); // Extract actual prop name
        const state = props[key];

        // If `state` is an array, assume [value, setValue]
        if (Array.isArray(state)) {
          newProps[propName] = state[0];
          const setter = state[1];
          const eventHandlerName = `on${propName
            .charAt(0)
            .toUpperCase()}${propName.slice(1)}`;
          newProps[eventHandlerName] = (e: any) => {
            setter(e.target?.value ?? e);
          };
        } else {
          // If `state` is from `$state`, bind directly
          newProps[propName] = state[propName];
          const eventHandlerName = `on${propName
            .charAt(0)
            .toUpperCase()}${propName.slice(1)}`;
          newProps[eventHandlerName] = (e: any) => {
            state[propName] = e.target?.value ?? e; // Trigger reactive update
          };
        }
        delete newProps[key]; // Remove the `bind:<prop_name>` prop
      }
    });

    return <Component {...newProps} />;
  };
}

export // HOC to add `v-model` support for $state
function withVModel<T extends object>(
  Component: React.ComponentType<T>
): React.FC<T & { "v-model"?: any }> {
  return ({ "v-model": model, ...props }: any) => {
    const newProps: any = { ...props };

    if (model) {
      let state = model;

      // Bind `value` or equivalent property for input elements
      newProps.value = state.value ?? state;

      // Bind `onChange` or equivalent event handler
      newProps.onChange = (e: any) => {
        const newValue = e.target?.value ?? e;
        console.log({newValue});
        state.value ? (state.value = newValue) : (state = newValue); // Update $state
      };
    }

    return <Component {...newProps} />;
  };
}