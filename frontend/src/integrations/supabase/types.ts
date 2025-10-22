export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_pages: {
        Row: {
          content: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          meta_description: string | null
          page_type: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          page_type: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          page_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      academic_downloads: {
        Row: {
          category: string
          created_at: string
          department: string | null
          description: string | null
          download_count: number
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          department?: string | null
          description?: string | null
          download_count?: number
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          department?: string | null
          description?: string | null
          download_count?: number
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      academic_pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_active: boolean
          meta_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      academic_services: {
        Row: {
          created_at: string
          description: string | null
          icon: string
          id: string
          is_active: boolean
          link_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      accreditation_info: {
        Row: {
          accreditation_type: string
          benefits: string | null
          certificate_url: string | null
          created_at: string
          description: string | null
          grade_rating: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
          validity_period: string | null
        }
        Insert: {
          accreditation_type: string
          benefits?: string | null
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          grade_rating?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          validity_period?: string | null
        }
        Update: {
          accreditation_type?: string
          benefits?: string | null
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          grade_rating?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          validity_period?: string | null
        }
        Relationships: []
      }
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_roles: {
        Row: {
          created_at: string | null
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          role_level: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role_level: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role_level?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      amenities: {
        Row: {
          booking_required: boolean
          category: string
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          name: string
          operating_hours: string | null
          updated_at: string
        }
        Insert: {
          booking_required?: boolean
          category?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name: string
          operating_hours?: string | null
          updated_at?: string
        }
        Update: {
          booking_required?: boolean
          category?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name?: string
          operating_hours?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      awards_achievements: {
        Row: {
          award_date: string | null
          category: string
          certificate_url: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          award_date?: string | null
          category?: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          award_date?: string | null
          category?: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campus_events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          max_participants: number | null
          organizer: string | null
          registration_required: boolean
          registration_url: string | null
          start_date: string | null
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          max_participants?: number | null
          organizer?: string | null
          registration_required?: boolean
          registration_url?: string | null
          start_date?: string | null
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          max_participants?: number | null
          organizer?: string | null
          registration_required?: boolean
          registration_url?: string | null
          start_date?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      campus_life_content: {
        Row: {
          content: string | null
          created_at: string
          display_order: number
          features: string[] | null
          gallery_images: string[] | null
          hero_image_url: string | null
          highlights: string[] | null
          id: string
          is_active: boolean
          meta_description: string | null
          page_slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          display_order?: number
          features?: string[] | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          highlights?: string[] | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          page_slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          display_order?: number
          features?: string[] | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          highlights?: string[] | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          page_slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campus_pages: {
        Row: {
          content: string | null
          created_at: string
          display_order: number
          hero_image_url: string | null
          id: string
          is_active: boolean
          meta_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          display_order?: number
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          display_order?: number
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campus_stats: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          stat_name: string
          stat_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          stat_name: string
          stat_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          stat_name?: string
          stat_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      clubs: {
        Row: {
          created_at: string
          description: string | null
          event_count: number
          icon: string
          id: string
          is_active: boolean
          member_count: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_count?: number
          icon: string
          id?: string
          is_active?: boolean
          member_count?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_count?: number
          icon?: string
          id?: string
          is_active?: boolean
          member_count?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          department: string | null
          designation: string | null
          display_order: number
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean
          location_map_url: string | null
          office_hours: string | null
          office_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          display_order?: number
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location_map_url?: string | null
          office_hours?: string | null
          office_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          display_order?: number
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location_map_url?: string | null
          office_hours?: string | null
          office_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      creative_works: {
        Row: {
          author_department: string | null
          author_name: string
          category: string
          content_url: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          title: string
          updated_at: string
        }
        Insert: {
          author_department?: string | null
          author_name: string
          category: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          author_department?: string | null
          author_name?: string
          category?: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          achievements: string[] | null
          code: string
          contact_email: string | null
          created_at: string
          description: string | null
          facilities: string[] | null
          gallery_images: string[] | null
          head_name: string | null
          hero_image_url: string | null
          id: string
          is_active: boolean
          location_details: string | null
          mission: string | null
          name: string
          programs_offered: string[] | null
          updated_at: string
          vision: string | null
        }
        Insert: {
          achievements?: string[] | null
          code: string
          contact_email?: string | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          gallery_images?: string[] | null
          head_name?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          location_details?: string | null
          mission?: string | null
          name: string
          programs_offered?: string[] | null
          updated_at?: string
          vision?: string | null
        }
        Update: {
          achievements?: string[] | null
          code?: string
          contact_email?: string | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          gallery_images?: string[] | null
          head_name?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          location_details?: string | null
          mission?: string | null
          name?: string
          programs_offered?: string[] | null
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      faculty_departments: {
        Row: {
          created_at: string | null
          department_id: string | null
          faculty_id: string | null
          id: string
          is_hod: boolean | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          faculty_id?: string | null
          id?: string
          is_hod?: boolean | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          faculty_id?: string | null
          id?: string
          is_hod?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_departments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fees_structure: {
        Row: {
          academic_year: string
          amount: number | null
          category: string
          created_at: string
          department: string | null
          description: string | null
          due_date: string | null
          id: string
          is_active: boolean
          semester: string | null
          title: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          amount?: number | null
          category?: string
          created_at?: string
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_active?: boolean
          semester?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          amount?: number | null
          category?: string
          created_at?: string
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_active?: boolean
          semester?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hostel_info: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          facilities: string[] | null
          fee_structure: Json | null
          hostel_type: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          rooms_available: number
          rules: string | null
          updated_at: string
          warden_contact: string | null
          warden_name: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          fee_structure?: Json | null
          hostel_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          rooms_available?: number
          rules?: string | null
          updated_at?: string
          warden_contact?: string | null
          warden_name?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          fee_structure?: Json | null
          hostel_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          rooms_available?: number
          rules?: string | null
          updated_at?: string
          warden_contact?: string | null
          warden_name?: string | null
        }
        Relationships: []
      }
      incubation_centers: {
        Row: {
          center_type: string
          created_at: string
          current_startups: number | null
          description: string | null
          establishment_date: string | null
          features: string[] | null
          gallery_images: string[] | null
          grant_amount: number | null
          grant_currency: string | null
          id: string
          image_url: string | null
          is_active: boolean
          logo_url: string | null
          name: string
          success_stories: string[] | null
          total_funding_raised: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          center_type: string
          created_at?: string
          current_startups?: number | null
          description?: string | null
          establishment_date?: string | null
          features?: string[] | null
          gallery_images?: string[] | null
          grant_amount?: number | null
          grant_currency?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          logo_url?: string | null
          name: string
          success_stories?: string[] | null
          total_funding_raised?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          center_type?: string
          created_at?: string
          current_startups?: number | null
          description?: string | null
          establishment_date?: string | null
          features?: string[] | null
          gallery_images?: string[] | null
          grant_amount?: number | null
          grant_currency?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          logo_url?: string | null
          name?: string
          success_stories?: string[] | null
          total_funding_raised?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      leadership_messages: {
        Row: {
          created_at: string
          designation: string | null
          id: string
          is_active: boolean
          message: string
          name: string
          photo_url: string | null
          position: string
          qualifications: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          designation?: string | null
          id?: string
          is_active?: boolean
          message: string
          name: string
          photo_url?: string | null
          position: string
          qualifications?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          designation?: string | null
          id?: string
          is_active?: boolean
          message?: string
          name?: string
          photo_url?: string | null
          position?: string
          qualifications?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      magazines: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          is_active: boolean
          issue_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          issue_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          issue_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_announcements: {
        Row: {
          author: string | null
          category: string
          content: string | null
          created_at: string
          expiry_date: string | null
          external_url: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_breaking: boolean
          is_featured: boolean
          publish_date: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string
          expiry_date?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_breaking?: boolean
          is_featured?: boolean
          publish_date?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string
          expiry_date?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_breaking?: boolean
          is_featured?: boolean
          publish_date?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          is_new: boolean
          priority: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          is_new?: boolean
          priority?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          is_new?: boolean
          priority?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      office_locations: {
        Row: {
          address: string | null
          building: string | null
          created_at: string
          email: string | null
          floor: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_main_office: boolean
          landmark: string | null
          map_coordinates: string | null
          name: string
          office_hours: string | null
          phone: string | null
          room_number: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          building?: string | null
          created_at?: string
          email?: string | null
          floor?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_main_office?: boolean
          landmark?: string | null
          map_coordinates?: string | null
          name: string
          office_hours?: string | null
          phone?: string | null
          room_number?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          building?: string | null
          created_at?: string
          email?: string | null
          floor?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_main_office?: boolean
          landmark?: string | null
          map_coordinates?: string | null
          name?: string
          office_hours?: string | null
          phone?: string | null
          room_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      photo_galleries: {
        Row: {
          alt_text: string | null
          caption: string | null
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          is_featured: boolean
          photo_date: string | null
          photographer: string | null
          subcategory: string | null
          title: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          category: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          is_featured?: boolean
          photo_date?: string | null
          photographer?: string | null
          subcategory?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          is_featured?: boolean
          photo_date?: string | null
          photographer?: string | null
          subcategory?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          branch: string | null
          created_at: string
          current_position: string | null
          department: string | null
          designation: string | null
          email: string
          enrollment_year: number | null
          full_name: string | null
          graduation_year: number | null
          id: string
          photo_url: string | null
          qualifications: string | null
          research_areas: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          role_type: string | null
          semester: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          branch?: string | null
          created_at?: string
          current_position?: string | null
          department?: string | null
          designation?: string | null
          email: string
          enrollment_year?: number | null
          full_name?: string | null
          graduation_year?: number | null
          id?: string
          photo_url?: string | null
          qualifications?: string | null
          research_areas?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          role_type?: string | null
          semester?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          branch?: string | null
          created_at?: string
          current_position?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          enrollment_year?: number | null
          full_name?: string | null
          graduation_year?: number | null
          id?: string
          photo_url?: string | null
          qualifications?: string | null
          research_areas?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          role_type?: string | null
          semester?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          author: string | null
          cover_image_url: string | null
          created_at: string
          department: string | null
          description: string | null
          download_count: number
          file_url: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          issue_number: string | null
          publication_date: string | null
          publication_type: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          download_count?: number
          file_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          issue_number?: string | null
          publication_date?: string | null
          publication_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          download_count?: number
          file_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          issue_number?: string | null
          publication_date?: string | null
          publication_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          amount: number | null
          application_deadline: string | null
          application_url: string | null
          created_at: string
          description: string | null
          eligibility_criteria: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          application_deadline?: string | null
          application_url?: string | null
          created_at?: string
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          application_deadline?: string | null
          application_url?: string | null
          created_at?: string
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_initiatives: {
        Row: {
          category: string
          created_at: string
          description: string | null
          end_date: string | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          impact_metrics: string | null
          is_active: boolean
          is_featured: boolean
          organizer: string | null
          participants_count: number | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          impact_metrics?: string | null
          is_active?: boolean
          is_featured?: boolean
          organizer?: string | null
          participants_count?: number | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          impact_metrics?: string | null
          is_active?: boolean
          is_featured?: boolean
          organizer?: string | null
          participants_count?: number | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sports_facilities: {
        Row: {
          booking_required: boolean
          capacity: number | null
          contact_email: string | null
          contact_person: string | null
          created_at: string
          description: string | null
          facility_type: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          operating_hours: string | null
          updated_at: string
        }
        Insert: {
          booking_required?: boolean
          capacity?: number | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string
          description?: string | null
          facility_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          operating_hours?: string | null
          updated_at?: string
        }
        Update: {
          booking_required?: boolean
          capacity?: number | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string
          description?: string | null
          facility_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          operating_hours?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      student_activities: {
        Row: {
          achievements: string[] | null
          category: string
          coordinator_email: string | null
          coordinator_name: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          meeting_schedule: string | null
          member_count: number | null
          name: string
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          category?: string
          coordinator_email?: string | null
          coordinator_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          meeting_schedule?: string | null
          member_count?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          category?: string
          coordinator_email?: string | null
          coordinator_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          meeting_schedule?: string | null
          member_count?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_governance: {
        Row: {
          bio: string | null
          contact_email: string | null
          created_at: string
          department: string | null
          id: string
          is_active: boolean
          photo_url: string | null
          position: string
          responsibilities: string[] | null
          student_name: string
          term_end: string | null
          term_start: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          photo_url?: string | null
          position: string
          responsibilities?: string[] | null
          student_name: string
          term_end?: string | null
          term_start?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          photo_url?: string | null
          position?: string
          responsibilities?: string[] | null
          student_name?: string
          term_end?: string | null
          term_start?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      student_submissions: {
        Row: {
          category: string
          created_at: string | null
          department: string | null
          description: string | null
          file_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          review_comments: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          department?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          review_comments?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          department?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          review_comments?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "student_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      timetables: {
        Row: {
          academic_year: string | null
          created_at: string
          department: string | null
          description: string | null
          file_url: string | null
          id: string
          is_active: boolean
          semester: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          semester?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          semester?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      toppers: {
        Row: {
          achievements: string[] | null
          cgpa: number
          created_at: string
          department: string
          id: string
          is_active: boolean
          name: string
          photo_url: string | null
          rank: number
          updated_at: string
          year: number
        }
        Insert: {
          achievements?: string[] | null
          cgpa: number
          created_at?: string
          department: string
          id?: string
          is_active?: boolean
          name: string
          photo_url?: string | null
          rank: number
          updated_at?: string
          year: number
        }
        Update: {
          achievements?: string[] | null
          cgpa?: number
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean
          name?: string
          photo_url?: string | null
          rank?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      wellness_programs: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          fee: number | null
          id: string
          image_url: string | null
          instructor: string | null
          is_active: boolean
          location: string | null
          max_participants: number | null
          name: string
          program_type: string
          registration_required: boolean
          schedule: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          fee?: number | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          is_active?: boolean
          location?: string | null
          max_participants?: number | null
          name: string
          program_type?: string
          registration_required?: boolean
          schedule?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          fee?: number | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          is_active?: boolean
          location?: string | null
          max_participants?: number | null
          name?: string
          program_type?: string
          registration_required?: boolean
          schedule?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      women_forum_events: {
        Row: {
          achievements: string[] | null
          created_at: string
          description: string | null
          event_date: string | null
          event_type: string
          gallery_images: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          max_participants: number | null
          registration_link: string | null
          speaker_designation: string | null
          speaker_name: string | null
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          achievements?: string[] | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type?: string
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          max_participants?: number | null
          registration_link?: string | null
          speaker_designation?: string | null
          speaker_name?: string | null
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          achievements?: string[] | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type?: string
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          max_participants?: number | null
          registration_link?: string | null
          speaker_designation?: string | null
          speaker_name?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_level: {
        Args: { required_level: number }
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "faculty" | "student" | "alumni"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "faculty", "student", "alumni"],
    },
  },
} as const
