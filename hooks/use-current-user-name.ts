import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfileName = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }
      console.log(data);
      setName(data.session?.user.user_metadata.full_name ?? "?");
    };

    fetchProfileName();
  }, []);

  return name || "?";
};
