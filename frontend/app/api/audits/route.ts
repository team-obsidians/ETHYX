import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Create new audit record
    const { data, error } = await supabase
      .from("audits")
      .insert({
        user_id: user.id,
        file_name: body.fileName,
        file_size: body.fileSize,
        blob_path: body.blobPath,
        row_count: body.rowCount,
        column_count: body.columnCount,
        target_column: body.targetColumn,
        prediction_column: body.predictionColumn,
        protected_attributes: body.protectedAttributes,
        positive_label: body.positiveLabel,
        task_type: body.taskType || "binary_classification",
        domain: body.domain || "general",
        strictness: body.strictness || "standard",
        status: "uploaded"
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json({ error: "Failed to create audit record" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create audit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch audits" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch audits error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
