import { supabase } from './src/integrations/supabase/client';

async function check() {
  const { data, error } = await supabase.from('animals').select('id, images').limit(5);
  console.log("Error:", error);
  console.log("Data:", JSON.stringify(data, null, 2));
  if (data && data.length > 0) {
    console.log("Type of images:", typeof data[0].images);
    console.log("Is Array?", Array.isArray(data[0].images));
  }
}

check();
