export const updateObject = (currentObject, newValues) => {
  return {
    ...currentObject,
    ...newValues,
  };
};

export const updateClass = (currentClasses, newClassses, shouldUpdate) => {
  if (shouldUpdate) {
    return [...currentClasses.split(" "), ...newClassses.split(" ")].join(" ");
  } else {
    return [...currentClasses.split(" ")].join(" ");
  }
};

export const destructObject = (
  initialObject = undefined,
  propertiesToDestructure = undefined
) => {
  if (initialObject === undefined || propertiesToDestructure === undefined) {
    throw new Error("BOTH PARAMETERS MUST HAVE A VALUE");
  }
  const newData = {};
  propertiesToDestructure.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(initialObject, item)) {
      newData[item] = initialObject[item];
    } else {
      throw new Error(
        `Initial Object does not have the property you want to destructure, CHECK ${item} ${initialObject[item]}`
      );
    }
  });
  return newData;
};

//LOGING WITH DESCRIPTION
export const log = (description, data) => {
  console.log(`[${description}]`, data);
};
