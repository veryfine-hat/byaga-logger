export function getClassName(obj: unknown): string {
    // If the object has a constructor and the constructor has a name, return it
    if (obj?.constructor?.name) {
        return obj.constructor.name;
    }

    // If the object has a prototype, recurse with the prototype
    if (obj && Object.getPrototypeOf(obj)) {
        return getClassName(Object.getPrototypeOf(obj));
    }

    // If no class name could be found, return the typeof the object
    return typeof obj;
}