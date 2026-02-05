import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Tables } from "@/integrations/supabase/types";

export const useCompany = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Tables<"companies"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompany(null);
      setIsLoading(false);
      return;
    }

    const fetchOrCreateCompany = async () => {
      setIsLoading(true);
      
      // Try to fetch existing company
      const { data: existingCompany, error: fetchError } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching company:", fetchError);
        setIsLoading(false);
        return;
      }

      if (existingCompany) {
        setCompany(existingCompany);
        setIsLoading(false);
        return;
      }

      // Create a new company for this user
      const { data: newCompany, error: createError } = await supabase
        .from("companies")
        .insert({
          user_id: user.id,
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "My Company",
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating company:", createError);
      } else {
        setCompany(newCompany);
      }
      
      setIsLoading(false);
    };

    fetchOrCreateCompany();
  }, [user]);

  return { company, isLoading };
};
