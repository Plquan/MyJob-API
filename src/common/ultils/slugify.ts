import slugify from "slugify";

export async function generateSlug(name: string, id: number): Promise<string> {
    const baseSlug = slugify(name, {
        lower: true,
        strict: true,
        locale: 'vi'
    });

    return `${baseSlug}-${id}`;
}